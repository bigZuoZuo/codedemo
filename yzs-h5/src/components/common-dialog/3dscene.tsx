/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {FC, MouseEvent, useEffect, useRef} from 'react'
import {
  DirectionalLight,
  Color,
  // FogExp2,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  // GridHelper,
  // AxesHelper,
  Raycaster,
  Vector2,
  // Vector3,
  // ArrowHelper,
} from 'three'
// @ts-ignore
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// @ts-ignore
import {TransformControls} from 'three/examples/jsm/controls/TransformControls'
// @ts-ignore
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'

interface Props {
  url: string
  onLoading?: Function
  onError?: Function
}

const fbxLoader = new FBXLoader()
let orbitControls: OrbitControls
let transformControl: TransformControls
const scene = new Scene()
let camera: PerspectiveCamera
const renderer = new WebGLRenderer()
const raycaster = new Raycaster()

const MyScene: FC<Props> = ({url, onLoading, onError}) => {
  const sceneWrapperRef = useRef<HTMLDivElement>(null)
  const width = () => {
    return sceneWrapperRef.current!.getBoundingClientRect().width
  }

  const height = () => {
    return sceneWrapperRef.current!.getBoundingClientRect().height
  }

  const getAspectRatio = () => {
    return width() / height()
  }

  useEffect(() => {
    // Adding helpers and background
    // scene.add(new GridHelper(1000, 10));
    // scene.add(new AxesHelper(100));
    scene.background = new Color(0xffffff)

    // setting up the Camera
    // camera = new PerspectiveCamera(60, getAspectRatio());
    camera = new PerspectiveCamera(20, getAspectRatio(), 1)
    camera.position.set(200, 200, 200)

    // Adding lights
    const light = new DirectionalLight(0xffffff)
    light.position.set(1, 1, 1)
    scene.add(light)

    // Adding controls
    orbitControls = new OrbitControls(camera, renderer.domElement)
    transformControl = new TransformControls(camera, renderer.domElement)
    transformControl.showX = false
    transformControl.showY = false
    transformControl.showZ = false
    transformControl.addEventListener('dragging-changed', (event) => {
      orbitControls.enabled = !event.value
      orbitControls.update()
    })
    scene.add(transformControl)

    renderer.setSize(width(), height())
    renderer.setPixelRatio(window.devicePixelRatio)

    sceneWrapperRef.current!.appendChild(renderer.domElement)

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    const cancelId = requestAnimationFrame(animate)

    window.onresize = () => {
      camera.aspect = getAspectRatio()
      camera.updateProjectionMatrix()

      renderer.setSize(width(), height())
    }

    return () => {
      cancelAnimationFrame(cancelId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateActiveObject = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    const xOffset = sceneWrapperRef.current?.getBoundingClientRect().left!
    const yOffset = sceneWrapperRef.current?.getBoundingClientRect().top!
    const x = ((event.clientX - xOffset) / width()) * 2 - 1
    const y = -((event.clientY - yOffset) / height()) * 2 + 1
    raycaster.setFromCamera(new Vector2(x, y), camera)
    const scene3dObjects = scene.children.filter((child) => child.type === 'Group')
    const scene3dObjectNames = scene3dObjects.map((obj) => obj.name)
    const intersects = raycaster.intersectObjects(scene3dObjects, true)
    if (intersects.length) {
      const parentObjectIndex = scene3dObjectNames.indexOf(intersects[0].object.name)
      if (parentObjectIndex >= 0) {
        transformControl.attach(scene3dObjects[parentObjectIndex])
      }
    }
  }

  useEffect(() => {
    fbxLoader.load(
      url,
      (obj) => {
        obj.traverse((child) => {
          child.castShadow = true
          child.receiveShadow = true
          child.name = '3dScene'
        })
        obj.name = '3dScene'
        transformControl.attach(obj)
        scene.add(obj)
      },
      (s) => {
        // console.warn(s);
        onLoading && onLoading(s)
      },
      (error) => {
        // console.error(error);
        onError && onError(error)
      }
    )
  }, [onError, onLoading, url])

  return (
    <div
      style={{width: '100%', height: '100%', minHeight: '100vh'}}
      ref={sceneWrapperRef}
      onClick={updateActiveObject}
    />
  )
}

export default MyScene
